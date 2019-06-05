package hello;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.awt.Point;
import java.awt.geom.Point2D;
import java.util.*;

@RestController
public class MBRController {

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/mbr", method = RequestMethod.POST)
    public ResponseEntity<List<Point>> mbr(@RequestBody List<Point> points) {
        Point2D.Double[] minimum = RotatingCalipers.getMinimumBoundingRectangle(points);

        List<Point> list = new ArrayList<Point>();
        for(Point2D.Double corner : minimum) {
            Point p = new Point((int)corner.x, (int)corner.y);
            list.add(p);
        }

        return new ResponseEntity<List<Point>>(list, HttpStatus.OK);
    }
}
